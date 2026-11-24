#!/bin/sh
set -eu

origin=${1:?Provide the HTTPS gateway origin}
shift

check_headers() {
    path=$1
    expected=$2
    shift 2
    headers=$(curl --silent --show-error --dump-header - --output /dev/null \
        "$@" "${origin%/}$path")
    status=$(printf '%s\n' "$headers" | awk '/^HTTP\// {status = $2} END {print status}')
    if [ "$status" != "$expected" ]; then
        printf '%s returned %s (expected %s)\n' "$path" "$status" "$expected" >&2
        return 1
    fi
    if printf '%s\n' "$headers" | grep -Eiq '^(Server|X-Powered-By):'; then
        printf '%s exposed a server identification header\n' "$path" >&2
        return 1
    fi
    printf '%s returned %s without server identification headers\n' "$path" "$status"
}

check_headers / 200 "$@"
check_headers /api/v1/session 401 "$@"
check_headers /actuator/health 404 "$@"

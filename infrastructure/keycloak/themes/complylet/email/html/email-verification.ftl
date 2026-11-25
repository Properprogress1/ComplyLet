<#ftl output_format="HTML" auto_esc=true>
<!doctype html>
<html lang="en-GB">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:24px;background:#f2f5f7;color:#172a35;font-family:Arial,sans-serif;font-size:16px;line-height:1.5">
<main style="max-width:560px;margin:0 auto;padding:24px;background:#fff;border:1px solid #d8e1e7">
    <p style="font-weight:bold;color:#155450">ComplyLet</p>
    <h1 style="font-size:26px;line-height:1.2">Verify your email address</h1>
    <p>Confirm that this email address belongs to you to finish setting up your ComplyLet account.</p>
    <p><a style="display:inline-block;padding:12px 18px;background:#155450;color:#fff;font-weight:bold" href="${link}">Verify email address</a></p>
    <p>This link expires in ${linkExpirationFormatter(linkExpiration)}.</p>
    <p>If the button does not work, copy this link into your browser:</p>
    <p style="overflow-wrap:anywhere;word-break:break-all"><a href="${link}">${link}</a></p>
    <p>If you did not register for ComplyLet, you can ignore this email.</p>
</main>
</body>
</html>

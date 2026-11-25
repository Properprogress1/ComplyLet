<#ftl output_format="HTML" auto_esc=true>
<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false; section>
    <#if section == "header">
        ${msg("emailVerifyTitle")}
    <#elseif section == "form">
        <#assign address = (verifyEmail!((user.email)!""))>
        <#if address?contains("@")>
            <#assign parts = address?split("@")>
            <#if parts?size == 2 && parts[0]?has_content>
                <p>Verification address <strong>${parts[0]?substring(0, 1)}•••@${parts[1]}</strong></p>
            </#if>
        </#if>
        <#if verifyEmail??>
            <p>Open the ComplyLet verification email and follow the link. Check your spam or junk folder if it has not arrived.</p>
        </#if>
        <#if isAppInitiatedAction??>
            <form class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
                <button class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!}" type="submit">
                    <#if verifyEmail??>${msg("emailVerifyResend")}<#else>${msg("emailVerifySend")}</#if>
                </button>
                <button class="${properties.kcButtonClass!}" type="submit" name="cancel-aia" value="true" formnovalidate>${msg("doCancel")}</button>
            </form>
        <#else>
            <p><a href="${url.loginAction}">Resend verification email</a></p>
            <p>Wait at least 60 seconds after requesting a message before trying again.</p>
            <p><a href="${url.loginRestartFlowUrl}">Return to sign in</a></p>
        </#if>
    </#if>
</@layout.registrationLayout>

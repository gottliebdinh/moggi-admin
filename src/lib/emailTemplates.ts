export function getEmailBase(content: string): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MOGGI - Asian Kitchen & Bar</title>
</head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background-color:#0A0A0A;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#0A0A0A;padding:40px 30px;text-align:center;border-bottom:3px solid #FF6B00;">
              <h1 style="margin:0;color:#FFFFFF;font-size:36px;font-weight:300;font-family:Georgia,serif;">MOGGI</h1>
              <p style="margin:10px 0 0 0;color:#FF6B00;font-size:14px;letter-spacing:2px;text-transform:uppercase;">Asian Kitchen & Bar</p>
            </td>
          </tr>
          ${content}
          <tr>
            <td style="background-color:#0A0A0A;padding:30px;text-align:center;border-top:1px solid #2A2A2A;">
              <p style="margin:0 0 12px 0;color:#FFFFFF;font-size:16px;font-weight:600;">MOGGI Asian Kitchen & Bar</p>
              <p style="margin:0 0 8px 0;color:#999999;font-size:14px;">Katharinengasse 14, 90403 Nürnberg</p>
              <p style="margin:0 0 8px 0;color:#999999;font-size:14px;">📞 0911 63290791</p>
              <p style="margin:0;color:#999999;font-size:14px;">📧 info@moggi-nuernberg.de</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function renderReservationMessageEmail(message: string): string {
  const content = `
  <tr>
    <td style="padding:24px 30px 10px;text-align:center;">
      <h2 style="margin:0;color:#FFFFFF;font-size:24px;font-weight:300;font-family:Georgia,serif;">Nachricht zu deiner Reservierung</h2>
    </td>
  </tr>
  <tr>
    <td style="padding:0 30px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;border-radius:12px;border-left:4px solid #FF6B00;">
        <tr>
          <td style="padding:20px;">
            <p style="margin:0;color:#FFFFFF;font-size:16px;line-height:24px;white-space:pre-wrap;">${escapeHtml(message)}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `
  return getEmailBase(content)
}

export function renderOrderMessageEmail(message: string): string {
  const content = `
  <tr>
    <td style="padding:24px 30px 10px;text-align:center;">
      <h2 style="margin:0;color:#FFFFFF;font-size:24px;font-weight:300;font-family:Georgia,serif;">Nachricht zu deiner Bestellung</h2>
    </td>
  </tr>
  <tr>
    <td style="padding:0 30px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;border-radius:12px;border-left:4px solid #FF6B00;">
        <tr>
          <td style="padding:20px;">
            <p style="margin:0;color:#FFFFFF;font-size:16px;line-height:24px;white-space:pre-wrap;">${escapeHtml(message)}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `
  return getEmailBase(content)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}



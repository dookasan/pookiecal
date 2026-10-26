import { GoogleEmailItem } from '../types/birthday';

interface GmailMessageHeader {
  name: string;
  value: string;
}

interface GmailMessageResponse {
  id: string;
  snippet: string;
  internalDate: string;
  payload?: {
    headers: GmailMessageHeader[];
  };
}

/**
 * Fetches real email threads with a specific contact from the Gmail API
 * using the OAuth access token acquired during Google Sign-in.
 */
export async function fetchLiveGmailMessages(
  accessToken: string,
  contactEmail: string
): Promise<{ success: boolean; messages: GoogleEmailItem[]; error?: string }> {
  if (!accessToken || !contactEmail) {
    return { success: false, messages: [], error: 'Missing token or email' };
  }

  try {
    const query = encodeURIComponent(`from:${contactEmail} OR to:${contactEmail}`);
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=8`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json'
        }
      }
    );

    if (!listRes.ok) {
      const errJson = await listRes.json().catch(() => ({}));
      return {
        success: false,
        messages: [],
        error: errJson.error?.message || `Gmail API returned HTTP ${listRes.status}`
      };
    }

    const listData = await listRes.json();
    if (!listData.messages || listData.messages.length === 0) {
      return { success: true, messages: [] };
    }

    // Fetch message metadata in parallel
    const messagePromises = listData.messages.map(async (msgItem: { id: string }) => {
      const detailRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgItem.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json'
          }
        }
      );
      if (!detailRes.ok) return null;
      const data: GmailMessageResponse = await detailRes.json();

      const headers = data.payload?.headers || [];
      const subjectHeader = headers.find((h) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
      const fromHeader = headers.find((h) => h.name.toLowerCase() === 'from')?.value || contactEmail;
      const dateHeader = headers.find((h) => h.name.toLowerCase() === 'date')?.value || '';

      let formattedDate = dateHeader;
      if (data.internalDate) {
        try {
          const d = new Date(Number(data.internalDate));
          formattedDate = d.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch {
          // keep dateHeader
        }
      }

      return {
        id: data.id,
        subject: subjectHeader,
        snippet: data.snippet || '',
        date: formattedDate,
        from: fromHeader
      } as GoogleEmailItem;
    });

    const results = await Promise.all(messagePromises);
    const validMessages = results.filter((m): m is GoogleEmailItem => m !== null);

    return {
      success: true,
      messages: validMessages
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error accessing Gmail API';
    return {
      success: false,
      messages: [],
      error: errorMsg
    };
  }
}

import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { purchaseCode, domain } = req.body;
    if (!purchaseCode) return res.status(400).json({ error: "Purchase code required" });

    const ENVATO_TOKEN = "FBXHNsCZAh18zeLahn4LemZgtOsh95WY";

    try {
        const response = await axios.get(`https://api.envato.com/v3/market/author/sale?code=${purchaseCode}`, {
            headers: { Authorization: `Bearer ${ENVATO_TOKEN}` }
        });
        
        const data = response.data;
        const unlock_key = Buffer.from(purchaseCode + "_AICLEX_SECRET_DB_KEY").toString('base64');
        
        return res.status(200).json({ 
            valid: true, 
            item_name: data.item.name,
            buyer: data.buyer,
            unlock_key: unlock_key
        });
    } catch (error) {
        return res.status(403).json({ valid: false, error: "Invalid or Nulled Purchase Code" });
    }
}

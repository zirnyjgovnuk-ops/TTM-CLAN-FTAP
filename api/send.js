module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    
    // Если открыть ссылку в браузере, покажет, что сервер жив
    if (req.method !== 'POST') return res.status(200).json({ ok: true, message: "Сервер работает" });

    const BOT_TOKEN = '9296428751:AAGZiHOzMyFwRt6ZhEhoEE29ohDgcG8RdxY';
    const ADMIN_CHAT_ID = '-1004399249500';
    
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Нет текста сообщения' });
    }

    try {
        // Отправляем в Telegram
        const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_CHAT_ID,
                text: `💬 <b>СООБЩЕНИЕ С САЙТА:</b> ${message}`,
                parse_mode: 'HTML'
            })
        });

        const tgData = await tgResponse.json();
        
        if (!tgData.ok) {
            return res.status(500).json({ error: 'Ошибка Telegram: ' + tgData.description });
        }

        return res.status(200).json({ ok: true });
    } catch (error) {
        return res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
    }
};

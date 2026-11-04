import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config();
const app = express(); app.use(cors()); app.use(express.json());
app.post('/api/improve', async (req,res) => {
  try {
    if (!process.env.OPENAI_API_KEY) return res.status(400).json({error:'Add OPENAI_API_KEY to .env to enable AI writing.'});
    const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    const {name, role, skills, experience} = req.body;
    const response = await client.chat.completions.create({
      model:'gpt-4o-mini',
      messages:[
        {role:'system',content:'Write concise, truthful resume content. Never invent employers, degrees, dates, metrics, or skills. If information is missing, use neutral wording.'},
        {role:'user',content:`Create a professional 3-sentence resume summary using only these facts. Name: ${name}; Target role: ${role}; Skills: ${skills}; Experience/project details: ${experience}`}
      ]
    });
    res.json({summary:response.choices[0].message.content});
  } catch(e) { res.status(500).json({error:e.message}); }
});
app.listen(process.env.PORT||4001,()=>console.log('API running on port',process.env.PORT||4001));

/**
 * Minimal CLI for sending a prompt to Claude and printing the response.
 *
 * Usage:
 *   node scripts/callClaude.js "your prompt here"
 */
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const prompt = process.argv.slice(2).join(' ');
if (!prompt) {
  console.error('Usage: node scripts/callClaude.js "your prompt here"');
  process.exit(1);
}

const client = new Anthropic();

const response = await client.messages.create({
  model: 'claude-opus-5',
  max_tokens: 16000,
  messages: [{ role: 'user', content: prompt }],
});

for (const block of response.content) {
  if (block.type === 'text') console.log(block.text);
}

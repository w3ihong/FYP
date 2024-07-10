import { spawn } from 'child_process';
import path from 'path';

export async function GET(request: Request) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, 'pytrends.py');
        const process = spawn('python', [scriptPath]);

        let data = '';
        process.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });

        process.stderr.on('data', (chunk) => {
            console.error(`stderr: ${chunk}`);
        });

        process.on('close', (code) => {
            if (code !== 0) {
                reject(new Response('Error fetching trends', { status: 500 }));
            } else {
                resolve(new Response(data, {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            }
        });
    });
}

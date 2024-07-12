import { spawn } from 'child_process';

export async function GET(request) {
    return new Promise((resolve, reject) => {
        // Get the URL and extract the 'country' query parameter
        const url = new URL(request.url);
        const country = url.searchParams.get('country') || 'worldwide'; // Default to 'worldwide' if no country is provided

        const scriptPath = 'C:\\Users\\yaswa\\Downloads\\FYP\\app\\api\\trending\\googleTrends.py';
        const process = spawn('python', [scriptPath, country]);

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

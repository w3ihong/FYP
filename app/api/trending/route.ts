import { spawn } from 'child_process';

export async function GET(request: Request): Promise<Response> {
    try {
        // Get the URL and extract the 'country' query parameter
        const url = new URL(request.url);
        const country = url.searchParams.get('country') || 'worldwide'; // Default to 'worldwide' if no country is provided

        const scriptPath = 'C:\\Users\\yaswa\\Downloads\\FYP\\app\\api\\trending\\googleTrends.py';

        return new Promise((resolve, reject) => {
            const process = spawn('python', [scriptPath, country]);

            let data = '';
            process.stdout.on('data', (chunk) => {
                data += chunk.toString();
            });

            process.stderr.on('data', (chunk) => {
                console.error(`stderr: ${chunk}`);
            });

            process.on('error', (err) => {
                console.error(`Failed to start subprocess: ${err}`);
                reject(new Response('Internal Server Error', { status: 500 }));
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Process exited with code: ${code}`);
                    reject(new Response('Error fetching trends', { status: 500 }));
                } else {
                    resolve(new Response(data, {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }
            });
        });
    } catch (error) {
        console.error(`Unexpected error: ${error}`);
        return new Response('Internal Server Error', { status: 500 });
    }
}


import React from 'react';

const codeSnippet = `
const SUPABASE_CONFIG = {
    url: 'PASTE_YOUR_PROJECT_URL_HERE',
    anonKey: 'PASTE_YOUR_ANON_PUBLIC_KEY_HERE'
};
`.trim();

const sqlSnippet = `
CREATE TABLE public.user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_lessons TEXT[]
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individual read access" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual insert access" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow individual update access" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
`.trim();

export const SupabaseSetupGuide: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl p-8 space-y-6 bg-brand-gray-dark rounded-xl border border-brand-red shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">
                        <span className="text-brand-red">Action Required:</span> Configure Supabase
                    </h1>
                    <p className="mt-2 text-brand-light-gray">
                        Your backend is not connected. To enable sign-up and login, you need to complete the following steps.
                    </p>
                </div>
                <div className="space-y-4 text-brand-off-white">
                    <h2 className="text-2xl font-bold text-brand-green border-b border-brand-border pb-2">Supabase Project Setup</h2>
                    <p>
                        <strong className="text-brand-green">Step 1: Get your API Credentials</strong>
                        <br/>
                        Go to your Supabase project dashboard, navigate to <strong>Settings &gt; API</strong>. You will need the <strong>Project URL</strong> and the <strong><code className="font-mono bg-brand-black px-1 rounded">anon</code> public key</strong>.
                    </p>
                    
                    <h2 className="text-2xl font-bold text-brand-green border-b border-brand-border pb-2 mt-6">Database Setup</h2>
                    <p>
                        <strong className="text-brand-green">Step 2: Create the Database Table</strong>
                        <br/>
                        Go to the <strong>SQL Editor</strong> in your Supabase dashboard. Click <strong>"New query"</strong>, then paste and <strong>run</strong> the following SQL script. This creates the table for user progress and sets up the necessary security rules.
                    </p>
                     <pre className="bg-brand-black rounded-lg p-4 my-2 overflow-x-auto border border-brand-border">
                        <code className="text-sm text-white whitespace-pre-wrap">{sqlSnippet}</code>
                    </pre>

                    <h2 className="text-2xl font-bold text-brand-green border-b border-brand-border pb-2 mt-6">Code Configuration</h2>
                    <p>
                        <strong className="text-brand-green">Step 3: Edit the Configuration File</strong>
                        <br/>
                        Open the following file in your project:
                        <code className="block text-center bg-brand-black border border-brand-border rounded-md px-4 py-2 mt-2 font-mono text-brand-green">
                            lib/appwrite.ts
                        </code>
                    </p>
                    <p>
                        <strong className="text-brand-green">Step 4: Paste Your Credentials</strong>
                        <br/>
                        Replace the placeholder values in the file with your actual Supabase URL and anon key from Step 1.
                    </p>
                    <pre className="bg-brand-black rounded-lg p-4 my-2 overflow-x-auto border border-brand-border">
                        <code className="text-sm text-white">{codeSnippet}</code>
                    </pre>
                </div>
                <div className="text-center text-sm text-brand-light-gray pt-4 border-t border-brand-border">
                    Once you complete these steps, the application will work correctly.
                </div>
            </div>
        </div>
    );
};

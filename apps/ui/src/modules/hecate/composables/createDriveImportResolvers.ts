import type { DriveEntry } from "@/composables/useDrive";
import { createCompiler, type HecateCompilerImportResolver } from "hecate/composables/createCompiler";

export interface Options {
    fromEntryPath?: string;
}

export function createDriveImportResolvers(options?: Options) {
    
    const { drive: _drive, decode } = useDrive();
    const drive = unref(_drive);


    const rootResolver: HecateCompilerImportResolver = {
        test: (key: string) => key.startsWith('@/'),
        resolve: async (key: string) => {
            const filename = key.slice(2);

            const entry = await drive.get(filename);
            
            if (!entry) {
                throw new Error(`File not found: ${filename}`);
            }

            const contents = await drive.read(filename);
            
            if (!contents) {
                throw new Error(`Failed to read file: ${filename}`);
            }

            const text = decode(contents);

            const compiler = createCompiler({
                importResolvers: createDriveImportResolvers({ fromEntryPath: filename }),
            });

            const result = await compiler.compile(text);

            if (result.error) {
                throw result.error;
            }

            return result.exports;
        }
    }

    return [rootResolver];
}
import fs from "fs";

import { test } from "@japa/runner";
import InitCommand from "./init";
import { createFakePath, cleanup } from "@tests/fixtures/fake-path";

test.group("init command", (group) => {
    group.each.teardown(cleanup);

    test("should create a folder .index-san in the directory", async ({
        expect,
    }) => {
        const folderPath = createFakePath();
        const configFolderPath = createFakePath(".index-san");

        await InitCommand.execute({
            args: [folderPath],
            prompt: {} as any,
        });

        const exist = fs.existsSync(configFolderPath);

        expect(exist).toBe(true);
    });

    test('should create a file "templates.json" in the directory .index-san', async ({
        expect,
    }) => {
        const templatesFilePath = createFakePath(
            ".index-san",
            "templates.json"
        );

        await InitCommand.execute({
            args: [createFakePath()],
            prompt: {} as any,
        });

        const exist = fs.existsSync(templatesFilePath);

        expect(exist).toBe(true);
    });

    test("should trigger error if already have .index-san folder", async ({
        expect,
    }) => {
        expect.assertions(1);

        const folderPath = createFakePath();
        const configFolderPath = createFakePath(".index-san");

        fs.mkdirSync(configFolderPath, { recursive: true });

        await InitCommand.execute({
            args: [folderPath],
            prompt: {} as any,
        }).catch((error) =>
            expect(error.message).toBe("The project already was initialized")
        );
    });
});

import "dotenv/config";
import { join } from "path";
import { writeJson } from "fs-extra";
import { Batcher } from "@botmock-api/client";
import { default as log } from "@botmock-api/log";
import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { SENTRY_DSN } from "./lib/constants";
import { default as pkg } from "./package.json";
import { default as FileWriter, restoreOutput } from "./lib/file";

declare global {
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
}

global.__rootdir__ = __dirname || process.cwd();

Sentry.init({
  dsn: SENTRY_DSN,
  release: `${pkg.name}@${pkg.version}`,
  integrations: [new RewriteFrames({
    root: global.__rootdir__
  })],
  beforeSend(event): Sentry.Event {
    if (event.user.email) {
      delete event.user.email;
    }
    return event;
  }
});

/**
 * Calls all fetch methods and calls all write methods
 * @remark entry point to the script
 * @param args argument vector
 */
async function main(args: string[]): Promise<void> {
  const DEFAULT_OUTPUT = "output";
  let [, , outputDirectory] = args;
  if (typeof outputDirectory === "undefined") {
    outputDirectory = process.env.OUTPUT_DIR;
  }
  const outputDir = join(__dirname, outputDirectory || DEFAULT_OUTPUT);
  log("recreating output directory");
  await restoreOutput(outputDir);
  log("fetching botmock assets");
  const { data: projectData } = await new Batcher({
    token: process.env.BOTMOCK_TOKEN,
    teamId: process.env.BOTMOCK_TEAM_ID,
    projectId: process.env.BOTMOCK_PROJECT_ID,
    boardId: process.env.BOTMOCK_BOARD_ID,
  }).batchRequest([
    "project",
    "board",
    "intents",
    "entities",
    "variables",
  ]);
  log("writing files");
  const fileWriter = new FileWriter({ outputDir, projectData });
  // @ts-ignore
  fileWriter.on("write-complete", ({ filepath }) => {
    log(`wrote ${filepath}`);
  });
  await fileWriter.write();
  log("done");
}

process.on("unhandledRejection", () => { });
process.on("uncaughtException", () => { });

main(process.argv).catch(async (err: Error) => {
  log(err.stack, { isError: true });
  if (process.env.OPT_IN_ERROR_REPORTING) {
    Sentry.captureException(err);
  } else {
    const { message, stack } = err;
    await writeJson(join(__dirname, "err.json"), {
      message,
      stack
    });
  }
});

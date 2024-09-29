#!/usr/bin/env node

import * as path from 'path';
import fileParser from './file_parser';
import GroqChat from './groq';
import argHandler from './args';
import fileWriter from './file_writer';
import type { MarkDownPayload } from './interfaces';
import markDownFileWriter from './markdown_file_writer';
import htmlFileWriter from './html_file_writer';
import tomlParser from './toml_parser';

/**
 * Main function to run the program.
 */
async function main() {
  const config = fileParser('.options.toml');
  const options = tomlParser(config);

  const {
    fileNames,
    model,
    temperature,
    apiKey,
    output,
    outputFiles,
    markDown,
    html,
    tokenUsageInformation, // add tokenUsageInformation for issue-12 to get information about token usage
  } = argHandler(options);

  const groqClient = GroqChat.getInstance(apiKey);

  let allResponses: MarkDownPayload[] = [];

  for (let i = 0; i < fileNames.length; ++i) {
    const filePath = path.resolve(fileNames[i]);
    const data = fileParser(filePath);

    console.log(`\nOptimizing ${fileNames[i]}...\n`);

    const response = await groqClient.run(
      fileNames[i],
      data,
      model,
      temperature,
      tokenUsageInformation, // add tokenUsageInformation for issue-12 to get information about token usage
    );

    if (response === 'Unable To Process') continue;

    if (markDown || html) {
      allResponses.push({
        before: data,
        after: response as string,
        fileName: fileNames[i],
      });
    }

    if (output && i < outputFiles.length) {
      console.log(`Writing to ${outputFiles[i]}`);
      fileWriter(response as string, outputFiles[i]);
    }
  }

  if (tokenUsageInformation) groqClient.logTotalTokenUsage(fileNames);

  if (markDown) markDownFileWriter(allResponses);

  if (html) htmlFileWriter(allResponses);
}

main();

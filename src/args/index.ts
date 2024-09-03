import handleVersionFlag from './flag_handlers/version';
import handleTemperatureFlag from './flag_handlers/temperature';
import handleModelFlag from './flag_handlers/model';
import handleHelpFlag from './flag_handlers/help';
import handleApiKeyFlag from './flag_handlers/apiKey';
import handleOutputFlag from './flag_handlers/output';
import handleMarkdownFlag from './flag_handlers/markdown';

/**
 * Handles the file names passed as arguments.
 *
 * @param { string[] } args - The arguments passed to the CLI.
 * @returns { string[] } The file names.
 */
function handleFileNames(args: string[]): string[] {
  const stopIndex = args.findIndex((arg) => arg.startsWith('-'));
  const fileNames = stopIndex === -1 ? args : args.slice(0, stopIndex);

  if (fileNames.length === 0) {
    console.error('Please provide a file name as an argument.');
    process.exit(1);
  }

  return fileNames;
}

/**
 * Handles the arguments passed to the CLI.
 *
 * @returns The arguments passed to the CLI.
 */
function argHandler() {
  const args = process.argv.slice(2);

  handleVersionFlag(args);
  handleHelpFlag(args);
  const fileNames = handleFileNames(args);
  const model = handleModelFlag(args);
  const temperature = handleTemperatureFlag(args);
  const apiKey = handleApiKeyFlag(args);
  const { output, outputFiles } = handleOutputFlag(args);
  const markDown = handleMarkdownFlag(args);

  return {
    fileNames,
    model,
    temperature,
    apiKey,
    output,
    outputFiles,
    markDown,
  };
}

export default argHandler;
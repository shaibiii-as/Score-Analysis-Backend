import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
// Import OpenAI langugage model and other related modules
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, loadQARefineChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// Import config file to get the openAIApiKey variables and fs for file system operations
import { config } from "../../config/var";
const { openAIApiKey } = config;
interface Document {
  pageContent: string | string[];
}

// Load local file .txt from ./docs
const loader = new DirectoryLoader("./docs", {
  ".txt": (path: string) => new TextLoader(path),
});

// Define a function to normalize the content of the documents
const normalizeDocuments = (docs: Document[]): string[] => {
  return docs.map((doc) => {
    if (typeof doc.pageContent === "string") {
      return doc.pageContent;
    } else if (Array.isArray(doc.pageContent)) {
      return doc.pageContent.join("\n");
    }
    return "";
  });
};

const VECTOR_STORE_PATH = "documents.index";
// Define the main function to run the entire process
export const getStdLLMFeedback = async (params: string): Promise<string> => {
  const prompt = params;

  const docs = (await loader.load()) as Document[];

  const model = new OpenAI({ openAIApiKey });

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
  });
  const normalizedDocs = normalizeDocuments(docs);
  const splitDocs = await textSplitter.createDocuments(normalizedDocs);

  // Generating the vector store from the documents
  const vectorStore = await HNSWLib.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings()
  );

  await vectorStore.save(VECTOR_STORE_PATH);

  // Query the retrieval chain with the specified question
  const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQARefineChain(model),
    retriever: vectorStore.asRetriever(),
  });

  const { output_text } = await chain.call({ query: prompt });
  if (output_text) return output_text.trim();
  else return "";
};

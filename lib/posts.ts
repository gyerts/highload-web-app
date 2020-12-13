import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts');

async function readPostsData() {
  let fileNames = fs.readdirSync(postsDirectory);
  fileNames = fileNames.filter(fileName => fileName.endsWith('.md'));

  const anAsyncFunction = async (fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    const processedContent = await remark().use(html).process(matterResult.content);

    // Combine the data with the id
    return {
      id,
      date: matterResult.data.date,
      title: matterResult.data.title,
      contentHtml: processedContent.toString(),
    }
  };

  // Get file names under /posts
  const allPostsData = await Promise.all(fileNames.map(fileName => anAsyncFunction(fileName)));

  // Sort posts by date
  allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  });

  const mapOfPosts = {};
  allPostsData.map(p => {
    mapOfPosts[p.id] = p;
  });

  return mapOfPosts;
}

export let mapOfPosts = {};

(async function () {
  mapOfPosts = await readPostsData();
})();


export function getSortedPostsData() {
  return Object.keys(mapOfPosts).map(id => mapOfPosts[id]);
}

export async function getPostData(id: string) {
  return mapOfPosts[id];
}

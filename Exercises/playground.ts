function getTimeout(seconds: number): string {
  return String(seconds * 1000);
}


const config = { baseURL: "https://staging.example.com" };
console.log(config.baseURL);  // Hint: case matters


function printName(name: string) {
  console.log(name);
}

const userName: string | undefined = undefined;

if (userName !== undefined) {
  printName(userName);
}
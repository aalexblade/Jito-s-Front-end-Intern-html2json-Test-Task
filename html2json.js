// Функція для конвертації HTML в JSON та відображення результату
function convertHtml2JsonAndSet() {
    const htmlTextAreaValue = document.getElementById("html").value;
    const jsonObj = html2json(htmlTextAreaValue);
    const jsonArea = document.getElementById("json");
    jsonArea.textContent = JSON.stringify(jsonObj, null, 2);
}

// Основна функція для конвертації HTML в JSON
function html2json(htmlText) {
    const tagRegex = /<\/?([a-zA-Z0-9\-]+)(\s[^>]*)?>|([^<]+)/g;

    function parseAttributes(attrStr) {
        const attributes = {};
        const attrRegex = /([a-zA-Z0-9\-]+)="([^"]*)"/g;
        let match;
        while ((match = attrRegex.exec(attrStr)) !== null) {
            attributes[match[1]] = match[2];
        }
        return attributes;
    }

    function parseNode() {
        const stack = [];
        let result = [];
        let match;

        while ((match = tagRegex.exec(htmlText)) !== null) {
            const [fullMatch, tagName, attrString, textContent] = match;

            if (textContent) {
                const trimmedText = textContent.trim();
                if (trimmedText) {
                    if (stack.length > 0) {
                        stack[stack.length - 1].children.push({ text: trimmedText });
                    } else {
                        result.push({ text: trimmedText });
                    }
                }
            } else if (tagName && fullMatch.startsWith("</")) {
                const element = stack.pop();
                if (stack.length > 0) {
                    stack[stack.length - 1].children.push(element);
                } else {
                    result.push(element);
                }
            } else if (tagName) {
                const newElement = {
                    tag: tagName.toLowerCase(),
                    attributes: attrString ? parseAttributes(attrString) : {},
                    children: []
                };
                stack.push(newElement);
            }
        }
        return result;
    }

    return parseNode();
}

// Функції для відображення прикладів HTML в текстовому полі
function showExample1() {
    const htmlExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport">
    <title>Sample HTML</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
    </header>
    <nav>
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>
    <main>
        <section id="home">
            <h2>Home Section</h2>
            <p>This is the home section of the webpage.</p>
        </section>
        <section id="about">
            <h2>About Section</h2>
            <p>This is the about section of the webpage.</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 My Website</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>`;
    document.getElementById("html").value = htmlExample;
    document.getElementById("json").textContent = JSON.stringify(
        { "Comment": "This example illustrates a full HTML document." },
        null, 2
    );
}

function showExample2() {
    const htmlExample = `<div>
<p>Hello world!</p>
<button>Click me!</button>
<textarea>Some very very long text...</textarea>
</div>`;
    document.getElementById("html").value = htmlExample;
    document.getElementById("json").textContent = JSON.stringify(
        { "Comment": "This example has nested elements with different tags." },
        null, 2
    );
}




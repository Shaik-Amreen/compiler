const express = require("express")
const app = express()
const cors = require("cors")
const { createCodeFile } = require("./createCodeFile");
const { executeJava, executePython, executeCorCPP } = require("./executeCode");


app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: "10000mb", extended: true }))
app.use(cors())
// app.use(express.static(path.join(__dirname, 'public')))

app.use(function (req, res, next) {
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self';");
    next();
});

app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,  Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'))
// })

const router = express.Router();
// Setup essential routes 

testcodeapi = async (data) => {
    const supportedLanguages = ["java", "cpp", "py", "c"];
    const compilerVersions = ["11.0.15", "11.2.0", "3.7.7", "11.2.0"];
    let output = "";
    const { language = "", code, input = "" } = data;
    if (code === undefined) output = "No code specified to execute.";
    if (!supportedLanguages.includes(language))
        output = `Language ${language} is not supported. Please refer to docs to know the supported languages.`;

    if (code !== undefined && supportedLanguages.includes(language)) {
        const codeFile = createCodeFile(language, code);

        switch (language) {
            case "java":
                output = await executeJava(codeFile, input);
                return { message: "data after params java", response: output }
                break;
            case "py":
                output = await executePython(codeFile, input);
                return { message: "data after params python", response: output }
                break;
            case "cpp":
                output = await executeCorCPP(codeFile, input);
                break;
            case "c":
                output = await executeCorCPP(codeFile, input);
                break;
        }
    }

    return output;
};



router.post('/', function (req, res) {

    req.body = JSON.parse(req.body.data);
    let response = []

    req.body.paramvalues.forEach(async (e, index) => {
        let code = req.body.ans;
        let language = req.body.language;
        let input = e.join("\n");
        let data = {
            code: code,
            language: language,
            input: input,
        };
        let s = await testcodeapi(data);
        return res.send({ response: "hello", data: s })
        console.log(s)
        response.push(s)
        if (index == req.body.paramvalues.length - 1) {
            return res.send({ message: "success", response: response })
        }

    });



    //__dirname : It will resolve to your project folder. 
});

//add the router 
app.use('/', router);

const host = '0.0.0.0';
const port = process.env.PORT || 4000;
app.listen(port, host, () => console.log("server listened" + port + host))
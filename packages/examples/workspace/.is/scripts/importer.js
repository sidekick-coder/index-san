async function main(workspace){

    const path = "tmp/stocks-dummy.csv"

    const content = await workspace.drive.read(path)

    if (!content) throw new Error("File not found")

    const lines = content.toString().split("\n")

    const headers = lines[0].split(",")
    const items= lines.slice(1).map(line => line.split(","))

   console.log("Headers: " + JSON.stringify(headers))

    for await (item of items) {
        console.log(item)
    }   

    return "Hello words"
}


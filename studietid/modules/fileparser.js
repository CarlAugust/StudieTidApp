import fs from 'fs';

export function readUserData(file)
{

    const lines = fs.readFileSync(`csvfiles/${file}.csv`, `utf-8`).split(`\n`);

    let data = [];

    for (let line of lines)
    {
        line = line.split(`;`);

        let newline = [];

        for (let element of line)
        {
            if (element != '' && element != '\r')
            {
                newline.push(element);
            }
        }
        data.push(newline);
    }

    data.pop();
    data[0].shift();

    for (let i = 0; i < data.length; i++)
    {
        if (data[i].length === 1)
        {
            console.log(data[i]);   
        }
    }

    return data;
}
import fs from 'fs';

export function readGroupData(file)
{
    const lines = fs.readFileSync(`csvfiles/${file}.csv`, `utf-8`).split(`\n`);

    let data = [];

    for (let line of lines)
    {
        line = line.split(`;`);

        let newline = [];

        for (const element of line)
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

    let Dita = {
        "Fag": {
            "Kode": [], 
            "Navn": [],
            "KlasserTilKoder": []
        },
        "Klasser": []
    };

    data.map((element) => {
        if (element.length == 0)
        {
            return;
        }

        if (element.length > 1)
        {
            if (element[1] !== undefined)
            {
                Dita.Fag.Kode.push(element[1]);
            }
            if (element[3] !== undefined)
            {
                const klasser = element[3].split(', ');
                Dita.Fag.KlasserTilKoder.push(klasser);

                for (const klasse of klasser)
                {
                    if (!Dita.Klasser.includes(klasse) && klasse)
                    {
                        Dita.Klasser.push(klasse);
                    }
                }
            }
        }
        else
        {
            if (element[0] !== undefined)
            {
                Dita.Fag.Navn.push(element[0].split(' ')[0]);
            }
        }
    });

    console.log(Dita);

    return Dita;
}
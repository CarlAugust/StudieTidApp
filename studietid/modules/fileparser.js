import fs from 'fs';

const CSVFileToArrayData = (file) => {
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

    return data;
};

const mapCSVToSubjectWithClassesObject = (data, Dita) => {
    data.map( (element) => 
    {
        if (element.length == 0)
        {
            return;
        }
    
        if (element.length > 1)
        {
            if (element[1] !== undefined)
            {
                Dita.Subject.Code.push(element[1]);
            }
            if (element[3] !== undefined)
            {
                const classes = element[3].split(', ');
                Dita.Subject.ClassesToCodes.push(classes);
    
                for (const c of classes)
                {
                    if (!Dita.Classes.includes(c) && c)
                    {
                        Dita.Classes.push(c);
                    }
                }
            }
        }
        else
        {
            if (element[0] !== undefined)
            {
                Dita.Subject.Name.push(element[0].split(' ')[0]);
            }
        }
    });
};


export function readGroupData(file)
{
    let data = CSVFileToArrayData(file);

    let Dita = {
        "Subject": {
            "Code": [], 
            "Name": [],
            "ClassesToCodes": []
        },
        "Classes": []
    };

    mapCSVToSubjectWithClassesObject(data, Dita);

    console.log(Dita);

    return Dita;
}
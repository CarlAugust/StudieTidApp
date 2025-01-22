import fs, { read } from 'fs';

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

    return data;
};

const mapCSVToSubjectWithClassesObject = (data, GroupsData) => {
    data.map( (element) => 
    {
        if (element.length == 0)
        {
            return;
        }
    
        if (element.length > 1)
        {
            let code = element[1];
            if (code !== undefined)
            {
                GroupsData.Subject.Code.push(code);
                GroupsData.Codes.add(code);
            }
            if (element[3] !== undefined)
            {
                const classes = element[3].split(', ');
                GroupsData.Subject.ClassesToCodes.push(classes);
    
                for (const c of classes)
                {
                    GroupsData.Classes.add(c);   
                }
            }
        }
        else
        {
            let name = element[0];
            if (name !== undefined)
            {
                GroupsData.Subject.Name.push(name.split(' ')[0]);
                GroupsData.Names.add(name.split(' ')[0]);
            }
        }
    });
};


export function readGroupData(file)
{
    let data = CSVFileToArrayData(file);

    data.pop();
    data[0].shift(); 

    let GroupsData = {
        "Subject": {
            "Code": [], 
            "Name": [],
            "ClassesToCodes": []
        },
        "Classes": new Set(),
        "Codes": new Set(),
        "Names": new Set()
    };

    mapCSVToSubjectWithClassesObject(data, GroupsData);

    return GroupsData;
}

export function readUserData(file)
{
    let data = CSVFileToArrayData(file);
    data.shift();

    let Users = {
        "Class": [],
        "Email": [],
        "FirstName": [],
        "LastName": [],
        "ImageCode": []
    };

    data.map( (element) => 
    {
        Users.Class.push(element[0]);
        Users.FirstName.push(element[1]);
        Users.LastName.push(element[2]);
        Users.Email.push(element[3]);
        Users.ImageCode.push(element[4]);
    });

    return Users;
}
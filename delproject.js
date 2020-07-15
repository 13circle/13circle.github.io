const fs = require('fs');
const async = require('async');

const project_filename = process.argv.slice(2, 3).pop();

if(project_filename == null) {
    console.log('Please enter a project name.');
    process.exit(1);
}

const project_config = 'project-config.json';
const project_info = 'project-info';
const project_details = 'project-details';
const projectInfo = `${project_info}/${project_filename}.json`;
const projectDetail = `${project_details}/${project_filename}.html`;

if(!fs.existsSync(projectInfo)) {
    console.log(`Cannot find the project name "${project_filename}."`);
    process.exit(1);
}

async.waterfall([
    cb1 => {
        fs.readFile(project_config, (err, data) => {
            if(err) throw err;
            let json = JSON.parse(data);
            json[project_info].splice(json[project_info].indexOf(`${project_filename}.json`), 1);
            json[project_details].splice(json[project_details].indexOf(`${project_filename}.html`), 1);
            fs.writeFile(project_config, JSON.stringify(json, null, 4), 'utf8', err => {
                if(err) throw err;
                cb1(null);
            });
        });
    },
    cb2 => {
        fs.unlink(projectInfo, err => {
            if(err) throw err;
            cb2(null);
        });
    },
    cb3 => {
        fs.unlink(projectDetail, err => {
            if(err) throw err;
            cb3(null);
        });
    }
], err => {
    if(err) throw err;
    console.log(`Project deleted: "${project_filename}"`);
});
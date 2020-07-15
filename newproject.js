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

if(fs.existsSync(projectInfo)) {
    console.log('Cannot create duplicate project. A project name must be identical.');
    process.exit(1);
}

async.waterfall([
    cb1 => {
        fs.readFile(project_config, (err, data) => {
            if(err) throw err;
            let json = JSON.parse(data);
            json[project_info].push(`${project_filename}.json`);
            json[project_details].push(`${project_filename}.html`);
            fs.writeFile(project_config, JSON.stringify(json, null, 4), 'utf8', err => {
                if(err) throw err;
                cb1(null);
            });
        });
    },
    cb2 => {
        let json = JSON.stringify({
            'project-filename': `${project_filename}.json`,
            'project-title': '',
            'project-date': '',
            'project-desc': '',
            'project-tag': '',
            'project-github-link': '',
            'project-page-link': ''
        }, null, 4);
        fs.writeFile(projectInfo, json, 'utf8', err => {
            if(err) throw err;
            cb2(null);
        });
    },
    cb3 => {
        fs.writeFile(projectDetail, '', 'utf8', err => {
            if(err) throw err;
            cb3(null);
        });
    }
], err => {
    if(err) throw err;
    console.log(`New project added: "${project_filename}"`);
});
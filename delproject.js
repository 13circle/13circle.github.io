const fs = require('fs');
const async = require('async');

const project_filename = process.argv.slice(2, 3).pop();

if(project_filename == null) {
    console.log('Please enter a project name.');
    process.exit(1);
}

const project_info = './project-info';
const project_details = './project-details';
const projectInfo = `${project_info}/${project_filename}.json`;
const projectDetail = `${project_details}/${project_filename}.html`;

if(!fs.existsSync(projectInfo)) {
    console.log(`Cannot find the project name "${project_filename}."`);
    process.exit(1);
}

async.waterfall([
    cb1 => {
        fs.unlink(projectInfo, err => {
            if(err) throw err;
            cb1(null);
        });
    },
    cb2 => {
        fs.unlink(projectDetail, err => {
            if(err) throw err;
            cb2(null);
        });
    }
], err => {
    if(err) throw err;
    console.log(`Project deleted: "${project_filename}"`);
});
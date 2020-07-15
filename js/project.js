(function projectsOnload() {
    renderProjectList();
})();

function getReqProject() {
    return window.location.href.split('?').pop();
}

function renderProjectList() {
    var project_dir = 'project-info';
    var project_list = document.querySelector('.project-list');
    var xhr, json, a, jsons = [], projectConfig, json_names, configXHR;
    configXHR = getXHR(function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                projectConfig = JSON.parse(this.responseText);
                json_names = projectConfig[project_dir];
                json_names.forEach(json_name => {
                    xhr = getXHR(function() {
                        if(this.readyState == 4) {
                            if(this.status == 200) {
                                json = JSON.parse(this.responseText);
                                jsons.push(json);
                                if(jsons.length == json_names.length) {
                                    jsons = sortJSONarr(jsons);
                                    jsons.forEach(j => {
                                        a = document.createElement('a');
                                        a.href = j['project-page-link'];
                                        a.className = 'list-group-item';
                                        a.textContent = j['project-title'];
                                        project_list.appendChild(a);
                                        if(j['project-filename'] == getReqProject() + '.json') {
                                            for(var key in j) {
                                                var elmnts = document.querySelectorAll('.' + key), txhr;
                                                var project_detail = document.querySelector('.project-detail');
                                                if(elmnts.length > 0) {
                                                    elmnts.forEach(elmnt => {
                                                        if(elmnt.href) {
                                                            if(j[key].length > 0) elmnt.href = j[key];
                                                            else elmnt.removeAttribute('href');
                                                        }
                                                        elmnt.textContent = (j[key].length > 0) ? j[key] : 'None';
                                                    });
                                                    txhr = getXHR(function() {
                                                        if(this.readyState == 4) {
                                                            if(this.status == 200) {
                                                                project_detail.innerHTML = this.responseText.replace(/\n/g, '<br>');
                                                            }
                                                        }
                                                    });
                                                    txhr.open('GET', 'project-details/' + j['project-filename'].replace('.json', '.html'), true);
                                                    txhr.send();
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    });
                    xhr.open('GET', project_dir + '/' + json_name, true);
                    xhr.send();
                });
            }
        }
    });
    configXHR.open('GET', 'project-config.json', true);
    configXHR.send();
}
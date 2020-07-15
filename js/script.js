var toTopBtn;

window.onload = function() {
    renderProjectView();
    includeHTML('templates', 'template', function() {
        renderProjectMenu();
        setScrollToTopBtn();
        setSmoothAnchorMove();
        setTooltip();

        toTopBtn = document.querySelector('.to-top');
    });
};

function setScrollToTopBtn() {
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() > $(document).height() * 0.50) {
            toTopBtn.style.display = 'block';
        } else {
            toTopBtn.style.display = 'none';
        }
    });
}

function setSmoothAnchorMove() {
    $(document).on('click', 'a[href^="#to"]', function (event) {
        event.preventDefault();
    
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
    });
}

function setTooltip() {
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });
}

function getXHR(readyStateChangeCallBack) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    if(readyStateChangeCallBack) xhr.onreadystatechange = readyStateChangeCallBack;
    return xhr;
}

function sortJSONarr(jsons) {
    var sorted_jsons = jsons.slice();
    sorted_jsons.sort(function(a, b) {
        var f, l;
        if(typeof a != 'string') {
            f = JSON.stringify(a);
            l = JSON.stringify(b);
        } else {
            f = a; l = b;
        }
        return f.localeCompare(l);
    });
    return sorted_jsons;
}

function includeHTML(project_dir, attr, initCallback) {
    var elements, html, xhr;
    elements = document.querySelectorAll('div, span');
    for(var i = 0, json, key, elmnt; i < elements.length; i++) {
        if(html = elements[i].getAttribute(attr)) {
            xhr = getXHR(function() {
                if(this.readyState == 4) {
                    if(this.status == 200) {
                        elements[i].innerHTML = this.responseText;
                        if(json = elements[i].getAttribute('my-json-data')) {
                            json = JSON.parse(json);
                            for(key in json) {
                                if(elmnt = elements[i].querySelector('.' + key)) {
                                    if(elmnt.href) {
                                        if(json[key].length > 0)
                                            elmnt.href = json[key];
                                        else elmnt.textContent = '';
                                    } else elmnt.textContent = json[key];
                                }
                            }
                        }
                    }
                    if(this.status == 404)
                        elements[i].innerHTML = '404 - Page not found';
                    elements[i].removeAttribute(attr);
                    includeHTML(project_dir, attr, initCallback);
                    if((i == elements.length - 1) && initCallback) initCallback();
                }
            });
            if(html.lastIndexOf('.html') == -1) html += '.html';
            xhr.open('GET', project_dir + '/' + html, true);
            xhr.send();
            return;
        }
    }
}

function renderProjectView() {
    var project_dir = 'project-info', breakpt = 3;
    var card_list = document.querySelector('.project-card-list');
    var row, rows, configXHR, projectConfig, json_names;
    if(card_list) {
        row = document.createElement('div');
        row.className = 'row';
        card_list.appendChild(row);
        rows = card_list.querySelectorAll('.row');
        configXHR = getXHR(function() {
            if(this.readyState == 4) {
                if(this.status == 200) {
                    projectConfig = JSON.parse(this.responseText);
                    json_names = projectConfig[project_dir];
                    for(var i = 0, xhr, div, jsons = []; i < json_names.length; i++) {
                        xhr = getXHR(function() {
                            if(this.readyState == 4) {
                                if(this.status == 200) {
                                    jsons.push(this.responseText);
                                    if(jsons.length == json_names.length) {
                                        jsons.forEach((json, json_index) => {
                                            div = document.createElement('div');
                                            div.setAttribute('template', 'project-card');
                                            div.setAttribute('my-json-data', json);
                                            div.className = 'col-lg-4 mb-4';
                                            rows[rows.length - 1].innerHTML += div.outerHTML;
                                            if((json_index + 1) % breakpt == 0) {
                                                row = document.createElement('div');
                                                row.className = 'row';
                                                card_list.appendChild(row);
                                                rows = card_list.querySelectorAll('.row');
                                            }
                                        });
                                    }
                                }
                            }
                        });
                        xhr.open('GET', project_dir + '/' + json_names[i], true);
                        xhr.send();
                    }
                }
            }
        });
        configXHR.open('GET', 'project-config.json', true);
        configXHR.send();
    }
}

function renderProjectMenu() {
    var project_dir = 'project-info';
    var project_menu = document.querySelector('.project-menu');
    var xhr, a, jsons = [], json_names, projectConfig, configXHR;
    configXHR = getXHR(function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                projectConfig = JSON.parse(this.responseText);
                json_names = projectConfig[project_dir];
                project_menu.innerHTML = '';
                json_names.forEach(json_file => {
                    xhr = getXHR(function() {
                        if(this.readyState == 4) {
                            if(this.status == 200) {
                                jsons.push(JSON.parse(this.responseText));
                                if(jsons.length == json_names.length) {
                                    jsons.forEach(json => {
                                        a = document.createElement('a');
                                        a.className = 'dropdown-item';
                                        a.href = json['project-page-link'];
                                        a.textContent = json['project-title'];
                                        project_menu.appendChild(a);
                                    });
                                }
                            }
                        }
                    });
                    xhr.open('GET', project_dir + '/' + json_file, true);
                    xhr.send();
                });
            }
        }
    });
    configXHR.open('GET', 'project-config.json', true);
    configXHR.send();
}
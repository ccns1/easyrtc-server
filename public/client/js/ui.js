function unhideTab(item) {
    document.getElementById(item).classList.remove('is-hidden');
}


function hideTab(item) {
    document.getElementById(item).classList.add('is-hidden');
}


function activeThisTab(item) {
    document.getElementById(activeTab).classList.remove('is-active');
    activeTab = item;
    document.getElementById(activeTab).classList.add('is-active');
}


function clickTab(name) {
    switch(name) {
        case 'all-menu':
            activeThisTab(name);
            ['users', 'rooms', 'call', 'query'].forEach((item) => {
                    unhideTab(`${item}-menu-block`);
                });
            break;
        case 'users-menu':
            if(activeTab !== 'all-menu')
                unhideTab('users-menu-block');
            activeThisTab(name);
            ['rooms', 'call', 'query'].forEach((item) => {
                    hideTab(`${item}-menu-block`);
                });
            break;
        case 'rooms-menu':
            if(activeTab !== 'all-menu')
                unhideTab('rooms-menu-block');
            activeThisTab(name);
            ['users', 'call', 'query'].forEach((item) => {
                    hideTab(`${item}-menu-block`);
                });
            break;
        case 'call-menu':
            if(activeTab !== 'all-menu')
                unhideTab('call-menu-block');
            activeThisTab(name);
            ['users', 'rooms', 'query'].forEach((item) => {
                    hideTab(`${item}-menu-block`);
                });
            break;
        case 'query-menu':
            if(activeTab !== 'all-menu')
                unhideTab('query-menu-block');
            activeThisTab(name);
            ['users', 'rooms', 'call'].forEach((item) => {
                    hideTab(`${item}-menu-block`);
                });
            break;
        default:
            alert(`Произошла ошибка, ${name}`);
            break;
    }
    
}


function hideNotification(id) {
    document.getElementById(id).classList.add('is-hidden');
}


function toggleList(e) {
    let tmpElement = document.getElementById(e);
    if(tmpElement.classList.contains('is-hidden') === true) {
        tmpElement.classList.remove('is-hidden');
    } else {
        tmpElement.classList.add('is-hidden');
    }
}

function toggleModal(e) {
    document.getElementById(e).classList.toggle('is-active');
}

function toggleElement(e) {
    console.log(e);
    
    let element = document.getElementById(e);
    
    element.classList.contains('is-hidden');
    
    if(element.classList.contains('is-hidden') === true) {
        element.classList.remove('is-hidden');
    } else {
        element.classList.add('is-hidden');
    }
    
}
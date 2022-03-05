 export function isActive(node) {
    return node?.classList.contains('active');
}

export function setActive(node, isActive) {
    node?.classList[isActive ? 'add' : 'remove']('active');
}

export function resetFormHandler(handling) {
    return event => {
        event.preventDefault();
        handling(event);
        event.target.reset();
    }
}

export function submitForm(formNode) {
    formNode.querySelector('[type="submit"]').click();
}
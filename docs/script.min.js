document.addEventListener('DOMContentLoaded', ()=>{
    Array.from(document.getElementsByClassName('js-header__navigation-toggle')).forEach((toggle) => {
        toggle.addEventListener('click', () => {
            Array.from(document.getElementsByClassName('js-navigation')).forEach((navigation) => {
                if(!navigation.className.includes('header__navigation-links--expanded')) {
                    navigation.className += ' header__navigation-links--expanded';
                } else {
                    navigation.className = navigation.className.replace('header__navigation-links--expanded', '');
                }
            });
        })
    })
});

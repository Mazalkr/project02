// LOADER:
// NOTE TO SELF - DELETE setTimeout?
export const loader = document.querySelector('.spinner-wrapper') as HTMLElement;

export function displayLoader(): void {
    loader.style.opacity ='0.5';
    loader.style.display ='flex';
}
    
export function hideLoader() {
    setTimeout(() => {
    loader.style.opacity ='0';
    loader.style.display ='none';
    }, 300);
}

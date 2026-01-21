import Plugin from 'src/plugin-system/plugin.class';

export default class TocafixFooterPlugin extends Plugin {
    init() {
        this._registerEventListeners();
    }

    /**
     * Register event listeners for footer interactions
     * @private
     */
    _registerEventListeners() {
        // Get elements
        this.scrollTrigger = document.querySelector('.scroll-down');

        // Bind event handler
        this._onScrollClick = this._handleScrollClick.bind(this);

        // Add event listener
        if (this.scrollTrigger) {
            this.scrollTrigger.addEventListener('click', this._onScrollClick);
        }
    }

    /**
     * Find the next section to scroll to
     * @private
     * @returns {Element|null}
     */
    _findNextSection() {
        // Try to find the hero slider container
        const heroSlider = document.querySelector('.hero-slider-container');
        
        if (heroSlider) {
            // Find the next sibling CMS section
            let nextElement = heroSlider.nextElementSibling;
            
            while (nextElement) {
                if (nextElement.classList && 
                    (nextElement.classList.contains('cms-section') || 
                     nextElement.classList.contains('cms-block'))) {
                    return nextElement;
                }
                nextElement = nextElement.nextElementSibling;
            }
            
            // If no sibling found, try to find parent's next sibling
            const parent = heroSlider.parentElement;
            if (parent) {
                let parentNext = parent.nextElementSibling;
                while (parentNext) {
                    if (parentNext.classList && 
                        (parentNext.classList.contains('cms-section') || 
                         parentNext.classList.contains('cms-block'))) {
                        return parentNext;
                    }
                    parentNext = parentNext.nextElementSibling;
                }
            }
        }
        
        // Fallback: find any cms-section that's not inside the hero slider
        const allSections = document.querySelectorAll('.cms-section');
        for (let section of allSections) {
            if (!section.closest('.hero-slider-container')) {
                return section;
            }
        }
        
        // Last resort: return null and we'll scroll by viewport height
        return null;
    }

    /**
     * Handle scroll trigger click
     * @param {Event} event - The click event
     * @private
     */
    _handleScrollClick(event) {
        event.preventDefault();


        // Find the next section dynamically
        const targetSection = this._findNextSection();

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            // Fallback: scroll by one viewport height
            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Clean up event listeners when plugin is destroyed
     * @private
     */
    _destroy() {
        if (this.scrollTrigger) {
            this.scrollTrigger.removeEventListener('click', this._onScrollClick);
        }

        super._destroy();
    }
}
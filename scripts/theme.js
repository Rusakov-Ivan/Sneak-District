// === Theme Manager ===
class ThemeManager {
    constructor() {
        this.STORAGE_KEY = 'sneak-district-theme';
        this.currentTheme = this.getSavedTheme();
        this.systemTheme = this.getSystemTheme();

        // Элементы управления
        this.desktopToggle = document.getElementById('theme-toggle');
        this.mobileOptions = document.querySelectorAll('.theme-option');
        this.sunIcon = document.querySelector('.theme-icon-sun');
        this.moonIcon = document.querySelector('.theme-icon-moon');

        // Инициализация
        this.applyTheme(this.currentTheme);
        this.attachEventListeners();
        this.watchSystemTheme();
    }

    getSavedTheme() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved || 'dark';
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getEffectiveTheme(theme) {
        return theme === 'system' ? this.systemTheme : theme;
    }

    applyTheme(theme) {
        const effectiveTheme = this.getEffectiveTheme(theme);
        document.documentElement.setAttribute('data-theme', effectiveTheme);
        this.currentTheme = theme;
        localStorage.setItem(this.STORAGE_KEY, theme);
        this.updateUI(theme);
    }

    updateUI(theme) {
        // Обновляем иконки в десктопной кнопке
        if (this.sunIcon && this.moonIcon) {
            const effectiveTheme = this.getEffectiveTheme(theme);
            if (effectiveTheme === 'light') {
                this.sunIcon.setAttribute('hidden', '');
                this.moonIcon.removeAttribute('hidden');
            } else {
                this.moonIcon.setAttribute('hidden', '');
                this.sunIcon.removeAttribute('hidden');
            }
        }

        // Обновляем активное состояние в мобильном меню
        this.mobileOptions.forEach(option => {
            if (option.dataset.theme === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    toggleTheme() {
        // Переключение между светлой и тёмной темой
        const effectiveTheme = this.getEffectiveTheme(this.currentTheme);
        const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    attachEventListeners() {
        // Десктопная кнопка переключения
        if (this.desktopToggle) {
            this.desktopToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Мобильные опции
        this.mobileOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
            });
        });
    }

    watchSystemTheme() {
        // Отслеживание изменений системной темы
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            this.systemTheme = e.matches ? 'dark' : 'light';
            if (this.currentTheme === 'system') {
                this.applyTheme('system');
            }
        });
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

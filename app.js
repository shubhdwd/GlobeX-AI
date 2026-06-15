document.addEventListener('DOMContentLoaded', () => {

    // --- Dashboard Tabs Logic ---
    const dashNavItems = document.querySelectorAll('.dash-nav-item');
    const dashViews = document.querySelectorAll('.dash-view');

    dashNavItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all nav items and views
            dashNavItems.forEach(nav => nav.classList.remove('active'));
            dashViews.forEach(view => view.classList.add('hidden'));

            // Add active to clicked nav item
            item.classList.add('active');
            
            // Show corresponding view
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // --- Market Analyzer Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const productGroup = document.getElementById('product-input-group');
    const hsnGroup = document.getElementById('hsn-input-group');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if(btn.getAttribute('data-search-type') === 'product') {
                productGroup.classList.remove('hidden');
                hsnGroup.classList.add('hidden');
            } else {
                productGroup.classList.add('hidden');
                hsnGroup.classList.remove('hidden');
            }
        });
    });

    const analyzeBtn = document.getElementById('analyze-btn');
    const analyzerResults = document.getElementById('analyzer-results');
    const loader = document.querySelector('.loader');
    const resultsContent = document.querySelector('.results-content');

    analyzeBtn.addEventListener('click', () => {
        // Simple validation
        const productInput = document.getElementById('product-input').value;
        const hsnInput = document.getElementById('hsn-input').value;
        
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-search-type');

        if(activeTab === 'product' && !productInput) {
            alert('Please enter a product to analyze.');
            return;
        }
        
        if(activeTab === 'hsn' && !hsnInput) {
            alert('Please enter an HSN code to analyze.');
            return;
        }

        // Show results area and loader
        analyzerResults.classList.remove('hidden');
        loader.classList.remove('hidden');
        resultsContent.classList.add('hidden');

        // Simulate AI Processing Delay
        setTimeout(() => {
            loader.classList.add('hidden');
            resultsContent.classList.remove('hidden');
        }, 2000);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

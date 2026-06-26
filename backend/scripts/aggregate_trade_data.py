import pandas as pd
import json
import os
import random

def main():
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    csv_file = os.path.join(data_dir, 'commodity_trade_statistics_data.csv')
    
    print(f"Reading {csv_file} in chunks...")
    
    chunk_size = 500000
    aggregated_data = {}
    
    try:
        for chunk in pd.read_csv(csv_file, chunksize=chunk_size, usecols=['country_or_area', 'year', 'commodity', 'flow', 'trade_usd', 'category']):
            imports = chunk[(chunk['flow'] == 'Import') & (chunk['year'] >= 2014)]
            
            for _, row in imports.iterrows():
                country = str(row['country_or_area'])
                commodity = str(row['commodity'])
                trade_usd = float(row['trade_usd']) if not pd.isna(row['trade_usd']) else 0.0
                
                key = (country, commodity)
                if key not in aggregated_data:
                    aggregated_data[key] = {
                        'total_usd': 0.0,
                        'years_active': set(),
                        'category': str(row['category'])
                    }
                aggregated_data[key]['total_usd'] += trade_usd
                aggregated_data[key]['years_active'].add(row['year'])
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    print("Aggregation complete. Generating Opportunities and Buyers...")
    
    opportunities = []
    buyers = []
    
    industries = ['Textiles & Apparel', 'Spices & Condiments', 'Machinery', 'Chemicals', 'Pharmaceuticals', 'Agricultural Products', 'Gems & Jewelry', 'Electronics']
    
    by_commodity = {}
    for (country, commodity), data in aggregated_data.items():
        if commodity not in by_commodity:
            by_commodity[commodity] = []
        by_commodity[commodity].append({
            'country': country,
            'total_usd': data['total_usd'],
            'years_active': len(data['years_active']),
            'category': data['category']
        })
        
    for commodity, countries in by_commodity.items():
        top_countries = sorted(countries, key=lambda x: x['total_usd'], reverse=True)[:10]
        
        for c in top_countries:
            demandScore = min(99, int(50 + (c['total_usd'] / 10000000) * 5))
            competition = 'High' if c['total_usd'] > 100000000 else 'Medium' if c['total_usd'] > 10000000 else 'Low'
            
            opportunities.append({
                'productName': commodity,
                'category': c['category'],
                'country': c['country'],
                'demandScore': demandScore,
                'growthRate': f"+{random.randint(2, 15)}% CAGR",
                'competition': competition,
                'marketSize': f"${(c['total_usd'] / 1000000):.1f}M",
                'trend': 'Growing',
                'insights': f"Strong demand for {commodity} in {c['country']}. Total import volume is significant."
            })
            
            leadScore = min(99, int(40 + c['years_active'] * 8 + (c['total_usd'] / 50000000)))
            industry = next((ind for ind in industries if ind.lower() in c['category'].lower()), c['category'])
            companyPrefix = ''.join(e for e in commodity.split()[0].capitalize() if e.isalnum())
            countryPrefix = ''.join(e for e in c['country'].lower() if e.isalnum())
            
            buyers.append({
                'companyName': f"{c['country']} {companyPrefix} Importers Ltd",
                'country': c['country'],
                'industry': industry,
                'website': f"https://imports-{countryPrefix}.com",
                'email': f"procurement@{countryPrefix}imports.com",
                'leadScore': leadScore,
                'importVolume': competition,
                'tags': [companyPrefix.lower(), 'importer', countryPrefix],
                'productName': commodity
            })
            
    print(f"Generated {len(opportunities)} opportunities and {len(buyers)} buyers.")
    
    out_dir = os.path.join(data_dir, 'aggregated')
    os.makedirs(out_dir, exist_ok=True)
    
    with open(os.path.join(out_dir, 'opportunities.json'), 'w', encoding='utf-8') as f:
        json.dump(opportunities, f, indent=2)
        
    with open(os.path.join(out_dir, 'buyers.json'), 'w', encoding='utf-8') as f:
        json.dump(buyers, f, indent=2)
        
    print(f"Saved to {out_dir}")

if __name__ == "__main__":
    main()

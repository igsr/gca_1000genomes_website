module Jekyll
  class FaqMapGenerator < Jekyll::Generator
    safe true
    priority :lowest

    def generate(site)
      
      faq_map = Hash.new
      for faq in site.collections['faq'].docs
        faq_stub = faq.path[/([^\/]*)\.[^\.\/]*$/, 1]
        faq.data['stub_name'] = faq_stub
        faq_map[faq_stub] = faq.to_liquid
      end
      site.data['faq_map'] = faq_map
    end
  end

  class FaqCategoryMapGenerator < Jekyll::Generator
    safe true
    priority :lowest

    def generate(site)
      
      faq_category_map = Hash.new
      for faq_category in site.collections['faq_categories'].docs
        faq_category_stub = faq_category.path[/([^\/]*)\.[^\.\/]*$/, 1]
        faq_category.data['stub_name'] = faq_category_stub
        faq_category_map[faq_category_stub] = faq_category.to_liquid
      end
      site.data['faq_category_map'] = faq_category_map
    end
  end
  
end

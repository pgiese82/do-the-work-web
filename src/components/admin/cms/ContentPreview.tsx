
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Globe, Smartphone, Tablet, Monitor } from 'lucide-react';

export function ContentPreview() {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const { data: content = [] } = useQuery({
    queryKey: ['website-content-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('is_active', true)
        .order('section_type')
        .order('sort_order');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: settings = {} } = useQuery({
    queryKey: ['website-settings-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*');
      
      if (error) throw error;

      const settingsObj: Record<string, any> = {};
      data.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });
      
      return settingsObj;
    },
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcement_banners')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString())
        .lte('start_date', new Date().toISOString());
      
      if (error) throw error;
      return data;
    },
  });

  const { data: gallery = [] } = useQuery({
    queryKey: ['gallery-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  const getViewportWidth = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-6xl';
    }
  };

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.section_type]) {
      acc[item.section_type] = [];
    }
    acc[item.section_type].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Content Preview
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('desktop')}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tablet')}
              >
                <Tablet className="w-4 h-4 mr-2" />
                Tablet
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className={`mx-auto bg-white border rounded-lg overflow-hidden ${getViewportWidth()}`}>
              {/* Announcements */}
              {announcements.length > 0 && (
                <div className="space-y-2">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-3 text-center"
                      style={{
                        backgroundColor: announcement.background_color,
                        color: announcement.text_color
                      }}
                    >
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <p className="text-sm">{announcement.message}</p>
                      {announcement.link_url && announcement.link_text && (
                        <a href={announcement.link_url} className="underline text-sm">
                          {announcement.link_text}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Hero Section */}
              {groupedContent.hero && (
                <section className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {groupedContent.hero.map((item) => (
                    <div key={item.id} className="text-center">
                      <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
                      <p className="text-xl mb-6">{item.content}</p>
                      {item.image_url && (
                        <img src={item.image_url} alt={item.title} className="mx-auto rounded-lg max-w-sm" />
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* About Section */}
              {groupedContent.about && (
                <section className="p-8">
                  <h2 className="text-3xl font-bold text-center mb-6">Over Ons</h2>
                  <div className="space-y-6">
                    {groupedContent.about.map((item) => (
                      <div key={item.id} className="flex items-center gap-6">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.title} className="w-32 h-32 rounded-lg object-cover" />
                        )}
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                          <p>{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Services Section */}
              {groupedContent.service && (
                <section className="p-8 bg-gray-50">
                  <h2 className="text-3xl font-bold text-center mb-6">Onze Services</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedContent.service.map((item) => (
                      <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-4" />
                        )}
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p>{item.content}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Gallery Section */}
              {gallery.length > 0 && (
                <section className="p-8">
                  <h2 className="text-3xl font-bold text-center mb-6">Galerij</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {gallery.map((image) => (
                      <img
                        key={image.id}
                        src={image.image_url}
                        alt={image.alt_text || image.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Testimonials Section */}
              {groupedContent.testimonial && (
                <section className="p-8 bg-gray-50">
                  <h2 className="text-3xl font-bold text-center mb-6">Testimonials</h2>
                  <div className="space-y-6">
                    {groupedContent.testimonial.map((item) => (
                      <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm text-center">
                        <p className="italic mb-4">"{item.content}"</p>
                        <h4 className="font-semibold">{item.title}</h4>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Contact Section */}
              {groupedContent.contact && (
                <section className="p-8">
                  <h2 className="text-3xl font-bold text-center mb-6">Contact</h2>
                  <div className="text-center space-y-4">
                    {settings.contact_info && (
                      <div>
                        <p>Email: {settings.contact_info.email}</p>
                        <p>Telefoon: {settings.contact_info.phone}</p>
                        <p>Adres: {settings.contact_info.address}</p>
                      </div>
                    )}
                    {groupedContent.contact.map((item) => (
                      <div key={item.id}>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p>{item.content}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* WhatsApp Button */}
              {settings.whatsapp_button?.enabled && (
                <div className="fixed bottom-4 right-4">
                  <Button className="bg-green-500 hover:bg-green-600 rounded-full p-3">
                    <MessageSquare className="w-6 h-6" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

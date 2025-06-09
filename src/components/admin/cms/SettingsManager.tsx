
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Mail, MessageSquare, Bell, Globe, Users } from 'lucide-react';

interface SettingsManagerProps {
  onUpdate: () => void;
}

export function SettingsManager({ onUpdate }: SettingsManagerProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: settings = {}, isLoading, refetch } = useQuery({
    queryKey: ['website-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*');
      
      if (error) throw error;

      // Convert array to object for easier access
      const settingsObj: Record<string, any> = {};
      data.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });
      
      return settingsObj;
    },
  });

  const updateSetting = async (settingKey: string, settingValue: any) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('website_settings')
        .upsert({
          setting_key: settingKey,
          setting_value: settingValue
        });

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "Website settings have been updated successfully.",
      });

      refetch();
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating settings",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppUpdate = (field: string, value: any) => {
    const currentWhatsApp = settings.whatsapp_button || {};
    const updated = { ...currentWhatsApp, [field]: value };
    updateSetting('whatsapp_button', updated);
  };

  const handlePopupUpdate = (field: string, value: any) => {
    const currentPopup = settings.popup_modal || {};
    const updated = { ...currentPopup, [field]: value };
    updateSetting('popup_modal', updated);
  };

  const handleContactUpdate = (field: string, value: any) => {
    const currentContact = settings.contact_info || {};
    const updated = { ...currentContact, [field]: value };
    updateSetting('contact_info', updated);
  };

  const handleSocialUpdate = (field: string, value: any) => {
    const currentSocial = settings.social_media || {};
    const updated = { ...currentSocial, [field]: value };
    updateSetting('social_media', updated);
  };

  const handleMetadataUpdate = (field: string, value: any) => {
    const currentMetadata = settings.site_metadata || {};
    const updated = { ...currentMetadata, [field]: value };
    updateSetting('site_metadata', updated);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="popup">Popup Modal</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="metadata">Site Metadata</TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                WhatsApp Button Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.whatsapp_button?.enabled || false}
                  onCheckedChange={(checked) => handleWhatsAppUpdate('enabled', checked)}
                />
                <Label>Enable WhatsApp Button</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_phone">Phone Number</Label>
                <Input
                  id="whatsapp_phone"
                  value={settings.whatsapp_button?.phone || ''}
                  onChange={(e) => handleWhatsAppUpdate('phone', e.target.value)}
                  placeholder="+31612345678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_message">Default Message</Label>
                <Textarea
                  id="whatsapp_message"
                  value={settings.whatsapp_button?.message || ''}
                  onChange={(e) => handleWhatsAppUpdate('message', e.target.value)}
                  placeholder="Hallo! Ik heb een vraag over jullie services."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Popup Modal Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.popup_modal?.enabled || false}
                  onCheckedChange={(checked) => handlePopupUpdate('enabled', checked)}
                />
                <Label>Enable Popup Modal</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="popup_title">Popup Title</Label>
                <Input
                  id="popup_title"
                  value={settings.popup_modal?.title || ''}
                  onChange={(e) => handlePopupUpdate('title', e.target.value)}
                  placeholder="Welkom!"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="popup_content">Popup Content</Label>
                <Textarea
                  id="popup_content"
                  value={settings.popup_modal?.content || ''}
                  onChange={(e) => handlePopupUpdate('content', e.target.value)}
                  placeholder="Bedankt voor je bezoek aan onze website."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="popup_delay">Show Delay (milliseconds)</Label>
                <Input
                  id="popup_delay"
                  type="number"
                  value={settings.popup_modal?.show_delay || 3000}
                  onChange={(e) => handlePopupUpdate('show_delay', parseInt(e.target.value))}
                  placeholder="3000"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_info?.email || ''}
                  onChange={(e) => handleContactUpdate('email', e.target.value)}
                  placeholder="info@personaltrainer.nl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_info?.phone || ''}
                  onChange={(e) => handleContactUpdate('phone', e.target.value)}
                  placeholder="+31612345678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_address">Address</Label>
                <Textarea
                  id="contact_address"
                  value={settings.contact_info?.address || ''}
                  onChange={(e) => handleContactUpdate('address', e.target.value)}
                  placeholder="Amsterdam, Nederland"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social_facebook">Facebook URL</Label>
                <Input
                  id="social_facebook"
                  value={settings.social_media?.facebook || ''}
                  onChange={(e) => handleSocialUpdate('facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_instagram">Instagram URL</Label>
                <Input
                  id="social_instagram"
                  value={settings.social_media?.instagram || ''}
                  onChange={(e) => handleSocialUpdate('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourpage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                <Input
                  id="social_linkedin"
                  value={settings.social_media?.linkedin || ''}
                  onChange={(e) => handleSocialUpdate('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Site Metadata & SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Site Title</Label>
                <Input
                  id="meta_title"
                  value={settings.site_metadata?.title || ''}
                  onChange={(e) => handleMetadataUpdate('title', e.target.value)}
                  placeholder="Personal Trainer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Site Description</Label>
                <Textarea
                  id="meta_description"
                  value={settings.site_metadata?.description || ''}
                  onChange={(e) => handleMetadataUpdate('description', e.target.value)}
                  placeholder="Professionele personal training services"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={settings.site_metadata?.keywords || ''}
                  onChange={(e) => handleMetadataUpdate('keywords', e.target.value)}
                  placeholder="personal trainer, fitness, gezondheid"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

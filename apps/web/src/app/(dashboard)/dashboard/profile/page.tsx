'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link2,
  Code2,
  Share2,
  Save,
  CheckCircle2,
} from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  headline: z.string().max(200).optional(),
  bio: z.string().optional(),
  phone: z.string().max(50).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  website: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileManagementPage() {
  const { user, refreshUser } = useAuth();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      headline: '',
      bio: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      website: '',
      github: '',
      linkedin: '',
      twitter: '',
    },
  });

  // Populate form with existing profile data
  useEffect(() => {
    if (user?.profile) {
      reset({
        firstName: user.profile.firstName || '',
        lastName: user.profile.lastName || '',
        headline: user.profile.headline || '',
        bio: user.profile.bio || '',
        phone: user.profile.phone || '',
        address: user.profile.address || '',
        city: user.profile.city || '',
        country: user.profile.country || '',
        postalCode: user.profile.postalCode || '',
        website: user.profile.website || '',
        github: user.profile.github || '',
        linkedin: user.profile.linkedin || '',
        twitter: user.profile.twitter || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setSaveError(null);
      setSaveSuccess(false);

      await api.patch('/api/v1/users/me/profile', values);
      await refreshUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Profile Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update your personal details once. All changes automatically sync to your CVs and published portfolios.
        </p>
      </div>

      {saveSuccess && (
        <Alert variant="success" title="Profile Updated">
          Your profile changes have been saved to MySQL and are now reflected across your CVs and portfolios.
        </Alert>
      )}

      {saveError && <Alert variant="error">{saveError}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Basic information that appears in the header of your CV and portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Alex"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Morgan"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              label="Professional Headline"
              placeholder="e.g. Senior Full-Stack Engineer | Open Source Contributor"
              helperText="A concise summary of your current title and specialty"
              error={errors.headline?.message}
              {...register('headline')}
            />

            <div className="space-y-1.5">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Professional Bio / Summary
              </label>
              <textarea
                id="bio"
                rows={4}
                placeholder="Briefly describe your career background, core competencies, and career objectives..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                {...register('bio')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact &amp; Location</CardTitle>
            <CardDescription>Where recruiters and clients can reach you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="+1 (555) 019-2834"
                leftIcon={<Phone className="w-4 h-4" />}
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                label="Street Address"
                placeholder="123 Market St, Apt 4B"
                leftIcon={<MapPin className="w-4 h-4" />}
                error={errors.address?.message}
                {...register('address')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City"
                placeholder="San Francisco"
                error={errors.city?.message}
                {...register('city')}
              />
              <Input
                label="Country"
                placeholder="United States"
                error={errors.country?.message}
                {...register('country')}
              />
              <Input
                label="Postal Code"
                placeholder="94105"
                error={errors.postalCode?.message}
                {...register('postalCode')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social & Professional Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social &amp; Professional Links</CardTitle>
            <CardDescription>Links shown on your resume header and portfolio contact footer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Personal Website"
                placeholder="https://yourname.dev"
                leftIcon={<Globe className="w-4 h-4" />}
                error={errors.website?.message}
                {...register('website')}
              />
              <Input
                label="GitHub Profile"
                placeholder="https://github.com/username"
                leftIcon={<Code2 className="w-4 h-4" />}
                error={errors.github?.message}
                {...register('github')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="LinkedIn Profile"
                placeholder="https://linkedin.com/in/username"
                leftIcon={<Link2 className="w-4 h-4" />}
                error={errors.linkedin?.message}
                {...register('linkedin')}
              />
              <Input
                label="Twitter / X Profile"
                placeholder="https://twitter.com/username"
                leftIcon={<Share2 className="w-4 h-4" />}
                error={errors.twitter?.message}
                {...register('twitter')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

import React from 'react';
import CourseModuleDetailClient from './CourseModuleDetailClient';

export function generateStaticParams() {
  return [{ slug: 'stack' }, { slug: 'queue' }];
}

export default async function CourseModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CourseModuleDetailClient slug={slug} />;
}

// Shared helpers for the project pages: the order, each project's color field and its status style.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** Each project gets one of the three pastel fields, by its place in the homepage order. */
const colors = ['mint', 'coral', 'peach'] as const;
export type FieldColor = (typeof colors)[number];

const statusClass: Record<Project['data']['status'], string> = {
  Live: 'status-shipped',
  Shipped: 'status-shipped',
  Prototype: 'status-proto',
  Concept: 'status-proto',
  Retired: 'status-retired',
};
export const statusStyle = (project: Project) => statusClass[project.data.status];

export interface Ordered {
  project: Project;
  color: FieldColor;
}

/** Every project in homepage order (featured first), with its color. "Next project" walks this order and loops. */
export async function orderedProjects(): Promise<Ordered[]> {
  const projects = await getCollection('projects');
  projects.sort((a, b) => (a.data.featured ?? Infinity) - (b.data.featured ?? Infinity) || a.data.title.localeCompare(b.data.title));
  return projects.map((project, i) => ({ project, color: colors[i % colors.length] }));
}

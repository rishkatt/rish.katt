
export interface PortfolioProject {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl: string
  liveUrl: string
}

export const projectsData: PortfolioProject[] = [
  {
    id: 'portfolio-game',
    title: 'Interactive Portfolio Game',
    description: 'A top-down RPG-inspired portfolio website built with Phaser.',
    technologies: [
      'TypeScript',
      'Phaser',
      'Vite',
      'Tiled'
    ],
    githubUrl: 'https://github.com/rishkatt/rish.katt',
    liveUrl: ''
  },
  {
    id: 'example-project',
    title: 'Example Project',
    description: 'This is a second project used to test our portfolio system.',
    technologies: [
      'TypeScript',
      'HTML',
      'CSS'
    ],
    githubUrl: '',
    liveUrl: ''
  }
]

export function getProjectById(id: string): PortfolioProject | undefined {
  return projectsData.find(project => project.id === id)
}


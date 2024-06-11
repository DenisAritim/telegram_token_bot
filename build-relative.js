import pkg from 'fs-extra'
const { copySync, readdirSync, statSync, readFileSync, writeFileSync, existsSync, removeSync } = pkg
import { join, extname, relative, dirname } from 'path'
import { execSync } from 'child_process'

// Copy the current folder to "building"
function copyDirectory(source, destination) {
    copySync(source, destination, {
        filter: (src) => {
            return !src.includes('node_modules') && !src.includes('.git')
        },
    })
}

// Calculate and substitute paths in .ts files
function substitutePathsInTSFiles(directory, srcDirectory) {
    readdirSync(directory).forEach((file) => {
        const fullPath = join(directory, file)
        if (statSync(fullPath).isDirectory()) {
            substitutePathsInTSFiles(fullPath, srcDirectory)
        } else if (extname(fullPath) === '.ts') {
            let content = readFileSync(fullPath, 'utf8')
            const relativePath = relative(dirname(fullPath), srcDirectory)
            // Replace "@/"" with the calculated relative path, ensuring it ends with a "/"
            const newPath = relativePath.length > 0 ? `${relativePath.replace(/\\/g, '/')}/` : './'
            content = content.replace(/@\//g, newPath)
            writeFileSync(fullPath, content, 'utf8')
        }
    })
}

// Build the project with "yarn build"
function buildProject() {
    execSync('yarn', { stdio: 'inherit' })
    execSync('yarn build', { stdio: 'inherit' })
}

// Copy the build output to "out" folder in the original directory
function copyBuildOutput(source, destination) {
    copySync(source, destination)
}

// Orchestrates the steps
async function main() {
    const currentDirectory = process.cwd()
    const buildingDirectory = join(currentDirectory, '../building')
    const srcDirectory = join(buildingDirectory, 'src')
    const outputDirectory = join(currentDirectory, 'build')
    // Ensure the "building" and "out" directory are deleted
    if (existsSync(buildingDirectory)) {
        removeSync(buildingDirectory)
    }
    if (existsSync(outputDirectory)) {
        removeSync(outputDirectory)
    }

    copyDirectory(currentDirectory, buildingDirectory)
    substitutePathsInTSFiles(buildingDirectory, srcDirectory)
    process.chdir(buildingDirectory)
    copyDirectory(buildingDirectory, outputDirectory)

    process.chdir(currentDirectory) // Change back to the original directory after operation
}

main().catch(console.error)

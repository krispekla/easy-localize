export default class TreeNode {
	name: string;
	path: string;
	children: Array<TreeNode>;
	isDirectory: boolean;
	isIgnored: boolean;
	translations: Array<string>;

	constructor(path: string, name: string, isDirectory: boolean = false, isIgnored = false) {
		this.name = name;
		this.path = path;
		this.isDirectory = isDirectory;
		this.isIgnored = isIgnored;
		this.children = [];
		this.translations = [];
	}

	toJSON() {
		let { name, path, isDirectory, children, isIgnored } = this;
		return { name, path, isDirectory, children, isIgnored };
	}

	sort() {
		return this.children.sort(
			(a, b): number => (b.isDirectory as any) - (a.isDirectory as any) || Number(a.name < b.name)
		);
	}

	setTranslations(translations: string[]) {
		this.translations = translations;
	}
}

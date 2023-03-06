class DialogSupport {
	constructor() {
		this.signal = false;
	}

	async cancel() {
		this.signal = false;
	}

	async ok() {
		this.signal = false;
		return true;
	}

	open() {
		this.signal = true;
	}
}

export default DialogSupport;

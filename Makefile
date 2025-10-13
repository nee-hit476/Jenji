# Python virtual environment name
ENV_NAME=EDU

# Run frontend and backend separately
client:
	cd src/frontend && npm run dev

backend:
	conda activate ${ENV_NAME} && python src/api/live_app.py

install-client:
	cd src/frontend && npm install

train:
	conda activate ${ENV_NAME} && cd src/training && python train.py --cfg config.yaml --data ../dataset/data.yaml --epochs 50 --batch-size 16

# Run both frontend and backend together
run: 
	@echo "Starting jenji client ...."
	@echo "Staring jenji server ...."
	concurrently "make backend" "make install-client" "make client"








	
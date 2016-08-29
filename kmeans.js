function Kmeans(k) {
	this.k = k;
	this.centroids = [];
	this.n_features = 0;
	this.clusters = [];
}

Kmeans.prototype.init_centroids = function(ranges) {
	this.centroids = [];
	var f;
	for (var i = 0; i < this.k; i++) {
		var centroid = [];
		for (var j = 0; j < this.n_features; j++) {
			var x = this.get_random_in_range(ranges[j].min, ranges[j].max);
			centroid.push(x);
		}
		this.centroids.push(centroid);
	}
}

Kmeans.prototype.get_clusters = function(features) {
	this.validate_features(features);
	this.n_features = features[0].length;
	var ranges = this.get_features_range(features);
	this.init_centroids(ranges);
	this.clusters = [];
	for (var i = 0; i < features.length; i++) {
		this.clusters.push(-1)
	}
	this.iterate(features);
	return [this.clusters, this.centroids];
}

Kmeans.prototype.iterate = function(features) {
	var changed = true;
	var cluster_id;
	while (changed) {
		changed = false;
		console.log('iterating...');
		for (var i = 0; i < features.length; i++) {
			cluster_id = this.get_cluster_for_particle(features[i]);
			if (cluster_id != this.clusters[i]) {
				changed = true;
				this.clusters[i] = cluster_id;
			}
		}
		if (changed) {
			this.update_centroids(features);
		}
	}
}

Kmeans.prototype.update_centroids = function(features) {
	var counts = [];
	var cluster_id;
	this.centroids = [];
	for (var i = 0; i < this.k; i++) {
		counts.push(0);
		var c = [];
		for (var j = 0; j < this.n_features; j++) {
			c.push(0);
		}
		this.centroids.push(c);
	}

	for (var i = 0; i < this.clusters.length; i++) {
		cluster_id = this.clusters[i];
		this.centroids[cluster_id] = this.add_vectors(this.centroids[cluster_id], features[i]);
		counts[cluster_id] += 1;
	}

	for (var i = 0; i < this.k; i++) {
		for (var j = 0; j < this.n_features; j++) {
			this.centroids[i][j] /= counts[i];
		}
	}

}

Kmeans.prototype.add_vectors = function(a, b) {
	var sum = [];
	for (var i = 0; i < a.length; i++) {
		sum.push(a[i] + b[i]);
	}
	return sum;
}

Kmeans.prototype.get_cluster_for_particle = function(particle) {
	var min_dist = Number.MAX_VALUE;
	var cluster_id = -1;
	var dist;
	for (var i = 0; i < this.centroids.length; i++) {
		dist = this.get_distance(particle, this.centroids[i]);
		if (dist < min_dist) {
			cluster_id = i;
			min_dist = dist;
		}
	}
	return cluster_id;
}

Kmeans.prototype.get_distance = function(a, b) {
	var dist = 0;
	var diff;
	for (var i = 0; i < a.length; i++) {
		diff = a[i] - b[i];
		dist +=  diff * diff;		
	}
	return Math.sqrt(dist);
}

Kmeans.prototype.get_features_range = function(features) {
	var ranges = [];
	for (var i = 0; i < this.n_features; i++) {
		ranges.push({
			'min': Number.MAX_VALUE,
			'max': Number.MIN_VALUE
		});
	}
	for (var i = 0; i < features.length; i++) {
		for (var j = 0; j < this.n_features; j++) {
			if (features[i][j] < ranges[j].min) {
				ranges[j].min = features[i][j];
			}
			if (features[i][j] > ranges[j].max) {
				ranges[j].max = features[i][j];
			}
		}
	}
	return ranges;
}

Kmeans.prototype.validate_features = function(features) {
	if (features.length == 0) {
		throw "Features vector is empty";
	}
	
	var l = features[0].length;
	for (var i = 1; i < features.length; i++) {
		if (l != features[i].length) {
			throw "All feature vectors must have equal length";
		}
	}	
}

Kmeans.prototype.get_random_in_range = function(min, max) {
	return Math.random() * (max - min + 1) + min;
}
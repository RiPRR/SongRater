from scipy.stats import linregress
a = [4,3,2,3,2,4,2,2,2,2,3,3,3,3,2,2,3,3,2]
b = [1,0,0,0,0,1,2,2,1,0,0,0,1,1,0,1,0,0,0]
print(linregress(a, b))
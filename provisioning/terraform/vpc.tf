resource "aws_vpc" "kt-cloud-vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.kt-cloud-vpc.id
}

resource "aws_lb" "kt-cloud-nlb" {
  name               = "kt-cloud-nlb"
  internal           = false
  load_balancer_type = "network"
  subnets = [
    aws_subnet.public-ap-northeast-2a.id,
    aws_subnet.public-ap-northeast-2b.id
  ]
}
